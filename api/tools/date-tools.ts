export function getAge(birthDate: Date): number {
    const today: Date = new Date();
    let result: number = today.getFullYear() - birthDate.getFullYear();
    const months: number = today.getMonth() - birthDate.getMonth();
    if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
        result--;
    }
    return result;
}
